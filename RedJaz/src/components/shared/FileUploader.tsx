import {useCallback, useState} from 'react'
import {useDropzone, FileWithPath} from 'react-dropzone'
import { Button } from '../ui/button'

interface FileUploaderProps {
    fieldChange: (FILES: File[]) => void
    mediaUrl: string
}

const FileUploader = ({fieldChange, mediaUrl}: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState('')


    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles[0])
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))
      }, [file])
      const {getRootProps, getInputProps} = useDropzone({
        onDrop, 
        accept: {
            'image/*': ['.svg', '.png', '.jpg', '.jpeg']}
        })

      return (
        <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounder-x1 cursor-pointer' >
          <input {...getInputProps()} className='cursor-pointer' />
          {
            fileUrl ?(
                <div>
                    test 1
                </div>
            ) : (
                <div className='file_uploader-box'>
                    <img src="/assets/icons/file-upload.svg" alt="file-upload" width={96} height={77} />
                    <h3 className='base-medium text-light-2 mb-2 mt-6' >Drag photo here</h3>
                    <p className='text-light-4 small-regular mb-6' >SVG, PNG, JPG</p>

                    <Button className='shad-button_dark_4' >
                        Select from your device
                    </Button>
                </div>
            )
          }
        </div>
      )
}

export default FileUploader