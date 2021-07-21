const startRecordingButton = document.querySelector(".start-recording-button");
const stopRecordingButton = document.querySelector(".stop-recording-button");

const audioElement = document.querySelector(".audio");
const videoElement = document.querySelector(".video");

const recordingStatus = document.querySelector(".recording-status");

const saveButton = document.querySelector(".save-button");

var recorder;

startRecordingButton.addEventListener("click", function() {
    startRecordingButton.disabled = true;

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoElement
    }).then(async function(stream) {
        recorder = RecordRTC(stream, {
            type: 'audio'
        });
        recorder.startRecording();
    })
    
    recordingStatus.innerHTML = "Recording";
    stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener("click", function() {
    stopRecordingButton.disabled = true;

    recorder.stopRecording(function() {
        let blob = recorder.getBlob();
        
        // var file = new File([blob], "My file.webm", {
        //     type: "audio/webm"
        // });
        
        // const audioSources = document.querySelectorAll(".audio source");
        // if(audioSources) {
        //     for(let i = 0; i < audioSources.length; i++) {
        //         audioSources[i].remove();
        //     }
        // }
        // var newSource = document.createElement("source");
        // newSource.src = file;
        
        // audioElement.appendChild(newSource);
        audioElement.src = URL.createObjectURL(recorder.getBlob());

        // const formData = new FormData();
        // formData.append("file", file);

        // var request = new XMLHttpRequest();

        // request.open("POST", "/api/discussion");
        // request.send(formData);

        // console.log(file);
        // console.log(recorder)
        recordingStatus.innerHTML = "Stopped";
    });

    startRecordingButton.disabled = false;
});

saveButton.addEventListener("click", function() {
    var subject = document.querySelector(".form-input.subject").value;
    var colleague = document.querySelector(".form-input.colleague").value;
    var location = document.querySelector(".form-input.location").value;
    var outcome = document.querySelector(".form-input.outcome").value;

    let blob = recorder.getBlob();
        
    var file = new File([blob], "My file.webm", {
        type: "audio/webm"
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("colleague", colleague);
    formData.append("location", location);
    formData.append("outcome", outcome);

    var request = new XMLHttpRequest();

    request.open("POST", "/api/discussion");
    request.send(formData);
});