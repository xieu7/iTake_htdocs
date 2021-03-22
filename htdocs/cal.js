const URL = "./CF_MODEL/"

let model, webcam, labelContainer, maxPredictions;
let count_value = 0;
let one_shoot = false;
classification_init();

// Load the image model and setup the webcam
async function classification_init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true;
    webcam = new tmImage.Webcam(360, 738, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            let value = prediction[i].probability.toFixed(2);
            
            if(prediction[i].className=="香腸" && value >= 0.7)
            {
               document.getElementById("label-container").innerHTML = "想嘗"
            }
            else if(prediction[i].className=="Left" && value >= 0.99)
            {
                mBot_Left();
            }
            else if(prediction[i].className=="GO" && value >= 0.99)
            {
                mBot_Go();
            }
            else if(prediction[i].className=="STOP" && value >= 0.99)
            {
                mBot_Stop();
            }
            else if(prediction[i].className=="OTHER" && value >= 0.99)
            {
                console.log("OTHER");
            }
            else if(prediction[i].className=="BACK" && value >= 0.99)
            {
                mBot_Back();
            }

        // labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}