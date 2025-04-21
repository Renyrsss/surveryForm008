import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useState } from "react";

function Modal({ isOpen }: { isOpen: { data: boolean } }) {
    const { t, i18n } = useTranslation();
    const [langs, setLangs] = useState(t(""));
    function changeLang(e) {
        console.log(t(`lang${e.target.value}`));
        setLangs(t(`lang${e.target.value}`));
        i18n.changeLanguage(e.target.value);
    }
    return (
        <div>
            <div className='fixed w-full h-full bg-black opacity-45 z-10'></div>
            <div className='fixed z-20 bg-white top-[15%] left-[50%] translate-x-[-50%]  max-w-[600px] mx-auto p-[30px] rounded-2xl text-base/relaxed '>
                <div className='flex justify-center mb-[20px] items-center gap-[10px]'>
                    <MdLanguage />
                    <select onChange={(e) => changeLang(e)} name='lang'>
                        <option value='ru'>{t("langru")}</option>
                        <option value='kz'>{t("langkz")} </option>
                    </select>
                </div>
                <p className='text-center text-[22px] mb-[15px] '>{t("h1")}</p>
                <p className='mb-[30px]'>{t("title")}</p>

                <div className='flex justify-center'>
                    <button
                        onClick={() => isOpen(false)}
                        className=' cursor-pointer bg-[#1BB394] text-white py-[8px] px-[25px] rounded-xl'>
                        {t("agree")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
