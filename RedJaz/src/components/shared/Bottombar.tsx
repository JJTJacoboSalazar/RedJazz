import { bottombarLinks } from '@/constants'
import {Link, useLocation} from 'react-router-dom'

const Bottombar = () => {
  const {pathname} = useLocation()
  return (
    <section className="bottom-bar" >
      {bottombarLinks.map((link) =>{
              const isActive = pathname === link.route
              return (
                  <Link to={link.route} key={link.label} className={`${isActive && 'bg-primary-500 rounded-[10px]'} gap-1 flex flex-col items-center justify-center text-sm text-gray-500 group hover:text-white transition-all duration-300 ease-in-out p-2 ${isActive && 'text-white'
                  }`} >
                    <img 
                    src={link.imgURL} 
                    alt={link.label} 
                    width={20}
                    height={20}
                    className={` ${isActive && 'invert-white'}`} />
                    <p className='tiny-medium text-light-2' >{link.label}</p>
                  </Link>


              )
            })}
    </section>
  )
}

export default Bottombar