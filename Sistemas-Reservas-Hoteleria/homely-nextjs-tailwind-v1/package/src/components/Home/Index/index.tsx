interface GetInTouchProps {
    onOpenLogin?: () => void;
    onOpenRegister?: () => void;
}

const GetInTouch: React.FC<GetInTouchProps> = ({ onOpenLogin, onOpenRegister }) => {
    return (
        <section>
            <div className='container max-w-8xl mx-auto px-5 2xl:px-0'>
                <div className="relative rounded-t-2xl overflow-hidden min-h-[600px]">
                    <video
                        className="w-full h-full absolute top-0 left-0 object-cover z-0"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-label="Video background showing luxurious real estate"
                    >
                        <source src="https://res.cloudinary.com/dgzw14ypp/video/upload/v1770746350/7233782-hd_1920_1080_25fps_sm5thx.mp4" type="video/mp4" />
                    </video>

                    <div className="relative bg-black/30 lg:py-64 md:py-28 py-10 z-10">
                        <div className="flex flex-col items-center gap-8">
                            <h2 className='text-white lg:text-52 md:text-40 text-3xl max-w-3/4 text-center font-medium'>
                                Ingresa a nuestra página y descubre todas las habitaciones que tenemos para ti.
                            </h2>
                            <div className="flex flex-row gap-6 items-center">
                                <button
                                    onClick={onOpenLogin}
                                    className="bg-primary text-white px-8 py-4 rounded-full shadow-lg hover:bg-white hover:text-primary transition-all duration-300 font-medium text-lg"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={onOpenRegister}
                                    className="bg-white text-primary px-8 py-4 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium border-2 border-white text-lg"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GetInTouch;