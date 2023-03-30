import React, {useRef, useEffect,useState} from 'react'

const Scanpage = () => {
    //Camera rendering 
    const videoRef = useRef(null);
    const getVideo = () =>{
        navigator.mediaDevices.getUserMedia({video:{width: 600, height: 600}})
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err =>{
            console.log(err);

        })
    }

    useEffect(()=>{
        getVideo();
    },[videoRef])

    return(
        <div className="Scanpage">
            <p>Scan page</p>
            <div className = "camera">
                <video ref={videoRef}></video>

            </div>
        </div>
    )
}
export default Scanpage