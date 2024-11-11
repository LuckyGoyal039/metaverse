
import FeaturesList from "../../component/featureList";
import FlexCard from "../../component/flexCard";
import LandingHeader from "../../component/landingHeader";
import TestimonialCard from "../../component/testimonial";
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
    const testimonialList = [
        {
            profileImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/6707e52de54e1c296a0ef863_daniel-tobon-profile.jpeg",
            name: "Mike Mengell",
            title: "CTO and Co-Founder of CTO Labs",
            officeImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/671bb6eb14ee1ce0e7552c79_Daniel-Tobon-Feature-Card-2x.png",
            testimonial: "Team culture happens in the moments between meetings and we were hungry to get back into that norm. When we found Gather we instantly fell in love with it.",
            linkText: "Read Customer Story",
            linkUrl: "#",
        },
        {
            profileImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/6707e52de54e1c296a0ef863_daniel-tobon-profile.jpeg",
            name: "Mike Mengell",
            title: "CTO and Co-Founder of CTO Labs",
            officeImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/671bb6eb14ee1ce0e7552c79_Daniel-Tobon-Feature-Card-2x.png",
            testimonial: "Team culture happens in the moments between meetings and we were hungry to get back into that norm. When we found Gather we instantly fell in love with it.",
            linkText: "Read Customer Story",
            linkUrl: "#",
        },
        {
            profileImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/6707e52de54e1c296a0ef863_daniel-tobon-profile.jpeg",
            name: "Mike Mengell",
            title: "CTO and Co-Founder of CTO Labs",
            officeImage: "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/671bb6eb14ee1ce0e7552c79_Daniel-Tobon-Feature-Card-2x.png",
            testimonial: "Team culture happens in the moments between meetings and we were hungry to get back into that norm. When we found Gather we instantly fell in love with it.",
            linkText: "Read Customer Story",
            linkUrl: "#",
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

            <div className="pt-20">
                <div className="flex justify-center">
                    <h2 className="text-[3rem] font-bold text-white text-center w-[700px]">
                        Why distributed teams love Gather
                    </h2>
                </div>
                <div className="flex gap-5 justify-center mt-16">
                    {
                        testimonialList.map(ele => {
                            return (
                                <TestimonialCard
                                    profileImage={ele.profileImage}
                                    name={ele.name}
                                    title={ele.title}
                                    officeImage={ele.officeImage}
                                    testimonial={ele.testimonial}
                                    linkText={ele.linkText}
                                    linkUrl={ele.linkText}
                                />
                            )
                        })
                    }

                </div>
                <div className="text-center mt-16   ">
                    <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white rounded-lg">View More Testimonials</button>
                </div>
            </div>
            <div className="mt-20">
                <div className="rounded-xl flex justify-center">
                    <VideoPlayer src={"https://cdn.vidzflow.com/v/MB29PHd9nF_1080p_1691443966.mp4"} />
                </div>
                <div className="flex justify-center mt-14">
                    <h2 className="text-[3rem] font-bold text-white text-center">
                        Build a culture your remote team loves
                    </h2>
                </div>
                <div className="text-center mt-16">
                    <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 text-white rounded-lg">Get Started</button>
                </div>
            </div>
        </>
    )
}

export default Landing