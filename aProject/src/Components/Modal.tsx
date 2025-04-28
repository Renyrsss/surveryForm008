import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import Store from "../store/Store";

const Modal = observer(() => {
    const { t, i18n } = useTranslation();
    const [langs, setLangs] = useState(t(""));
    function changeLang(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        Store.locale = e.target.value;
        console.log(langs);
        setLangs(t(`lang${e.target.value}`));
        i18n.changeLanguage(e.target.value);
    }
    return (
        <div>
            <div className='fixed w-full h-full bg-black opacity-45 z-10'></div>
            <div className=' absolute z-20 bg-white top-[10%] left-[50%] translate-x-[-50%]  max-w-[600px] mx-auto p-[30px] rounded-2xl text-base/relaxed '>
                <div className='flex justify-center mb-[20px] items-center gap-[10px]'>
                    <MdLanguage />
                    <select onChange={(e) => changeLang(e)} name='lang'>
                        <option value='ru'>{t("langru")}</option>
                        <option value='kz'>{t("langkz")} </option>
                    </select>
                </div>
                <p className='text-center text-[18px] mb-[15px] '>{t("h1")}</p>
                <p className='mb-[30px] text-[16px]'>{t("title")}</p>

                <div className='flex justify-center'>
                    <button
                        onClick={() => (Store.isOpen = false)}
                        className=' cursor-pointer bg-[#1BB394] text-white py-[8px] px-[25px] rounded-xl'>
                        {t("agree")}
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Modal;
