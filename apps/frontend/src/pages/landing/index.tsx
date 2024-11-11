
import LandingHeader from "../../component/landingHeader";
import VideoPlayer from "../../component/vedioPlayer";

function Landing() {
    return (
        <>
            <LandingHeader />
            <div className="flex justify-around pt-24">
                <div className="flex flex-col gap-7 pt-40">
                    <h1 className="text-white text-6xl font-bold">Your <span className="opacity-30">Virtual HQ</span></h1>
                    <p className="text-xl text-white w-[500px]">Gather brings the best of in-person collaboration to distributed teams.</p>
                    <div className='font-semibold text-[#282d4e] bg-[#06d6a0] hover:bg-[#76dbc4] px-6 py-3 rounded-lg hover:bg-[#00a89d] w-36 text-lg'><p>Get Started</p></div>
                </div>
                <div className="rounded-xl">
                    <VideoPlayer src={"https://cdn.vidzflow.com/v/h3yy6rTnJQ_720p_1691443174.mp4"} />
                </div>
            </div>
        </>
    )
}

export default Landing