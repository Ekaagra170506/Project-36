//Create variables here
var dog,dogImg, happyDogImg, database, foodS, foodStock , milkImg ,foodObj;
var lastFed,fedTime,food,gameState,readState;
var bedroomImg,gardenImg,washroomImg,currentTime;
function preload()
{
	dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  milkImg = loadImage("images/Milk.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png")
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
	createCanvas(850, 500);

  database = firebase.database();

  dog = createSprite(650,250,5,5);
  dog.scale=  0.2;
  dog.addImage(dogImg);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  })

  feed = createButton("Feed the dog");
  feed.position(700,65);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,65);
  addFood.mousePressed(addFoods);

  food = new Food();
 

}


function draw() {  
  background(46,139,87);

  dog.display();
  food.display();

  
  //add styles here
  fill(255,255,254);
  stroke("white");
  textSize(15);

  if(lastFed>=12){
    text("Last Feed: "+lastFed%12 +" PM",200,30)
  }else if(lastFed==0){
    text("Last Feed: 12 AM",200,30);
  }else{
    text("Last Feed: "+lastFed+" AM",200,30);
  }

  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    food.garden();
  } else if(currentTime==(lastFed+2)){
    update("Sleeping");
    food.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    food.washroom();
  }else{
    update("Hungry");
    food.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
   // dog.addImage(dogImg);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  drawSprites();
}

function readStock(data)
{
    foodS = data.val();
    food.updateFoodStock(foodS);
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(happyDogImg);
  if(food.getFoodStock()<=0){
    food.updateFoodStock(food.getFoodStock()*0);
  }
  else{
    food.updateFoodStock(food.getFoodStock()-1)
  }
  database.ref('/').update({
    Food:food.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}



