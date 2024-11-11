
import FeaturesList from "../../component/featureList";
import FlexCard from "../../component/flexCard";
import LandingHeader from "../../component/landingHeader";
import VideoPlayer from "../../component/vedioPlayer";

function Landing() {
    const flexCardList = [
        {
            imgUrl: "https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaed7bdd2933eec28371_home%20proximity.png",
            headingOne: "PROXIMITY AND VISIBILITY",
            headingTwo: "Bring your remote team closer together",
            text: "Communicate, collaborate, and feel more connected in a persistent space that reflects your unique team culture.",
            reverse: false
        },
        {
            imgUrl: "https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaed50a294a779d34a2e_home%20moments.png",
            headingOne: "SERENDIPITOUS MOMENTS",
            headingTwo: "Talk naturally throughout your day",
            text: "Stop by someone's desk, say hi in the hallway, and bring back water cooler chats. No scheduling required.",
            reverse: true
        },
        {
            imgUrl: "https://cdn.prod.website-files.com/63c885e8fb810536398b658a/643efaedee179c6b6c275e75_home%20conversations.png",
            headingOne: "PRODUCTIVE CONVERSATIONS",
            headingTwo: "Meet in the moment",
            text: "Collaborate in the moment or schedule team meetings to keep everyone aligned and work moving forward.",
            reverse: false
        },
    ]
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
            <div>
                <div className="flex justify-center pt-24">
                    <h2 className="text-[3rem] font-bold text-white text-center w-[600px]">The in-person moments you've been missing</h2>
                </div>
                {
                    flexCardList.map(ele => {
                        return <FlexCard imgUrl={ele.imgUrl} headingOne={ele.headingOne} headingTwo={ele.headingTwo} reverse={ele.reverse} text={ele.text} />
                    })
                }
            </div>

            <div className="flex pt-24 flex-col w-full">
                <div className="flex justify-center">
                    <h2 className="text-[3rem] font-bold text-white text-center w-[700px]">
                        Everything remote teams need to get work done
                    </h2>
                </div>
                <div className="flex justify-center mt-20">
                    <FeaturesList />
                </div>
            </div>

        </>
    )
}

export default Landing