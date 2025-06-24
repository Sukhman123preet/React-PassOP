import React from 'react'
import Svg from './git_hub.jsx';
const Footer = () => {
    return (
        <div className='bg-slate-900 text-white flex flex-col justify-center items-center  w-full fixed bottom-0'>
            <div className="logo font-bold text-white text-2xl">
                <span className='text-green-500'> &lt;</span>

                <span>Pass</span><span className='text-green-500'>OP/&gt;</span>


            </div>
            <div className="flex justify-center items-center">
                Crafted  
                <img width="30" height="30" className='px-1' src="https://img.icons8.com/pieces/64/code.png" alt="code"/>
                 by Sukhmanpreet
                <span className='px-1'>
                    <Svg /></span>
            </div>

        </div>
    )
}

export default Footer