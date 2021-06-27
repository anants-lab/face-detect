console.log("hello");

const video = document.getElementById('video');

class Queue
{
    // Array is used to implement a Queue
    constructor()
    {
        this.items = [];
    }
    
    enqueue(element)
    {    
      // adding element to the queue
      this.items.push(element);
    }

    // dequeue function
    dequeue()
    {
        // removing element from the queue
        // returns underflow when called 
        // on empty queue
        if(this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }

    printQueue()
    {
        var str = "";
        for(var i = 0; i < this.items.length; i++)
            str += this.items[i] +" ";
        return str;
    }

    getLength(){
      return this.items.length;
  }

}

var queue = new Queue();


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.getElementById('video-display').append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    //console.log(resizedDetections)
    if(resizedDetections.length>0){
    var expressions = resizedDetections[0].expressions.asSortedArray()
    var exp = expressions[0].expression;
    //console.log(queue.getLength())
    if( queue.getLength()==10){
      queue.dequeue();
    }
    queue.enqueue(exp)

    //console.log(queue.printQueue())
  
    }
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
});

$("#suggest-btn").click(function(){
  let q=queue;
  
  var count = {
    'surprised':0,
    'disgusted':0,
    'happy':0,
    'sad':0,
    'neutral':0,
    'angry':0,
    'fearful':0
  };

  let max=0,exp="";
  while(!q.isEmpty()){
    var curr_exp = q.dequeue()
    count[curr_exp] += 1;
    if(count[curr_exp]>max){
      max=count[curr_exp];
      exp=curr_exp;
    }
  }
  //var exp = _.max(Object.keys(count), o => count[o]);

  console.log(exp);
  $.ajax({
    type:"get",
    url:`/expression/${exp}`,
    success:function(data){
      console.log(data.data);
      $("#movie-image img").attr("src",data.data.poster);
      $("#movie-desc-head").text(data.data.original_title);
      $("#movie-desc-rating").text(data.data.vote_average);
      $("#movie-desc-overview").text(data.data.overview);
      $("#dropdown-content").css("display","block");
      $("#suggest-btn button").text("Suggest Another Movie");
    }
  });
});