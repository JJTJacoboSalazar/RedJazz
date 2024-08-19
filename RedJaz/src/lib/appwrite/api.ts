import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser } from "../../types/index";

export async function createUserAccount(user: INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if(!newAccount){
            throw new Error('Account not created');
        }
        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser;

    } catch (error) {
     console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}){
   try {
    const newUser = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user,
    )

    if(!newUser){
        throw new Error('User not saved to database');
    }

    return newUser;
   } catch (error) {
       console.log(error);
       return error;
   }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        // Verificar si hay una sesión activa
        const currentSession = await account.getSession('current');
        if (currentSession) {
            // Cerrar la sesión activa
            await account.deleteSession('current');
        }

        // Crear una nueva sesión
        const session = await account.createEmailPasswordSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount){
            throw new Error('Account not found');
        }
        const currentUser= await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('$id', currentAccount.$id)]
        )

        if(!currentUser){
            throw new Error('User not found');
        }

        return currentUser.documents[0];
    
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function createPost(post: INewPost) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile){
            throw new Error('File not uploaded');
        }

        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl){
            deleteFile(uploadedFile.$id);
            throw new Error('File not found');
        }

        //convert tags to array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        )

        if(!newPost){
            await deleteFile(uploadedFile.$id);
            throw new Error('Post not created');
        }

        return newPost;
        
    } catch (error) {
        console.log(error);
        return error;
        
    }
}

export async function uploadFile(file: File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        if(!uploadedFile){
            throw new Error('File not uploaded');
        }

        return uploadedFile;
        
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
export async function deleteFile(fileId: string){
    try {
        const deletedFile = await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        )

        if(!deletedFile){
            throw new Error('File not deleted');
        }

        return {
            deletedFile,
            status: 'success'
        };
        
    } catch (error) {
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )

    if(!posts){
        throw new Error('Posts not found');
    }
    return posts
}

export async function likePost(postId: string, likesArray: string[]){
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatedPost){
            throw new Error('Post not updated');
        }
        return updatedPost;
    } catch (error) {
        console.log(error);        
    }
}