import React, {useRef, useEffect,useState} from 'react'
//camera
const Scanpage = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [hasPhoto, setHasPhoto] = useState(false);
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


        </div>
        <div className={'result'+ (hasPhoto ? 'hasPhoto': '')}>
            <canvas ref={photoRef}></canvas>
        </div>
    
        </div>
    )
}
export default Scanpage