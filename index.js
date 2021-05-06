let key=""
let firstSearchUl=document.querySelector("#first-search-ul")
let secondSearchUl=document.querySelector("#second-search-ul")
let CompareDiv=document.getElementById("compare-column")
let CompareButton=document.getElementById("compare-button")
let firstForm=document.getElementById("first-search-form")
let secondForm= document.getElementById("second-search-form")
let compareResult=document.getElementById("compare-result")
//let channel1   //channel1 json
//let channel2   //channel2 json

// function showCompareButton(){
//     let button=document.createElement('button')
//     button.textContent="Compare"
//     CompareDiv.
// }
firstForm.addEventListener("submit",function(e){getSearchResult(e,firstSearchUl)})
secondForm.addEventListener("submit",function(e){getSearchResult(e,secondSearchUl)})

// get a search list using the form keywords
function getSearchResult(event,targetUl){
    targetUl.dataset.itemChosen=false
    compareResult.textContent=""
    event.preventDefault(); 
    searchBar=event.target.querySelector('input[type=text]')
    if(searchBar.value!=''){
     fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchBar.value}&key=${key}`)
    .then(response=>response.json())
    .then(function(data){
        //console.log(filterUniqeChannels(data.items))
       return filterUniqeChannels(data.items)})
    .then(function(data){displaySearchResult(data,targetUl)})
}
    else{
        let warning=document.createElement('li')
        warning.textContent='Please enter a search keyword'
        targetUl.textContent=""
        targetUl.appendChild(warning)
    }
}


function filterUniqeChannels(searchList){
    let unique={}
    let filtered=searchList.filter(item=>!unique[item.snippet.title] && (unique[item.snippet.title] = true))
    return filtered
}

function displaySearchResult(searchList,targetUl){
    //console.log(searchList)
    targetUl.textContent=""
    for(item of searchList){
        let li=document.createElement('li')
        li.data=item.snippet.channelId

        let img=document.createElement('img')
        img.src=item.snippet.thumbnails.default.url
        
        let name=document.createElement('h3')
        name.textContent=item.snippet.channelTitle

        li.appendChild(img)
        li.appendChild(name)
        targetUl.appendChild(li)

        li.addEventListener('click',function(e){getChannelData(li.data,targetUl)})
    }    
}
//function(data){
   // console.log(data.items[0].statistics.viewCount)
function getChannelData(channelId,targetUl){
    targetUl.dataset.itemChosen=true
    fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${key}`)
    .then(data=>data.json())
    .then(data=>data.items[0])
    .then(function(data){
        targetUl.dataset.channel=JSON.stringify(data)
        console.log(targetUl.dataset.channel)
        console.log(data)
        displayChannelDetails(data,targetUl)})
}

function displayChannelDetails(data,targetUl){
    targetUl.textContent=''
    let li=document.createElement('li')

    //create the image element
    let img=document.createElement('img')
    img.src=data.snippet.thumbnails.default.url
    li.appendChild(img)

    //create the name headding
    let name=document.createElement('h3')
    name.textContent=data.snippet.title
    //name.classList.add("channel-name")
    li.appendChild(name)

    //create the video count heading 
    let vidCount=document.createElement('h3')
    vidCount.innerHTML=`<span class="profile-heading">Video Counts: </span>${data.statistics.videoCount}`
    //vidCount.classList.add("vidCount")
    li.appendChild(vidCount)

    let viewCount=document.createElement('h3')
    viewCount.innerHTML=`<span class="profile-heading">View Count: </span>${data.statistics.viewCount}`
    //vidCount.classList.add("viewCount")
    li.appendChild(viewCount)

    let subCount=document.createElement('h3')
    if (data.statistics.subscriberCount){
    //subCount.classList.add("subCount")
    subCount.innerHTML=`<span class="profile-heading">Sunscriber Count: </span>${data.statistics.subscriberCount}`
    }
    else{
        subCount.innerHTML=`<span class="profile-heading">Sunscribers Count: </span>Hidden`
        targetUl.dataset.channel.statistics.subscriberCount=0
    }
    

    li.appendChild(subCount)
    targetUl.appendChild(li)
}

CompareButton.addEventListener('click',getCompare)

function getCompare(){
    compareResult.textContent=""
 if(firstSearchUl.dataset.itemChosen && secondSearchUl.dataset.itemChosen) {
     displayCompare()
//     let firstVidCount=firstSearchUl.querySelector(".vidCount").textContent
//     let secondVidCount=secondSearchUl.querySelector(".vidCount").textContent
//     console.log(firstSearchUl.querySelector(".channel-name").textContent)

//     let nameLable=document.createElement('div')
//     compareResult.appendChild(nameLable)
//     nameLable.textContent="Video count"

//     let channelName=document.createElement('p')
//     compareResult.appendChild(channelName)

//     if(parseInt(firstVidCount)>parseInt(secondVidCount)){
//         channelName.textContent=firstSearchUl.querySelector(".channel-name").textContent
//     }
//     else if(parseInt(firstVidCount)<parseInt(secondVidCount)){
//         compareResult.textContent=secondSearchUl.querySelector(".channel-name").textContent
//     }
//     else{ //equal videos count
//         compareResult.textContent="Equal"
//     }
  }  
 else{
    compareResult.textContent="Please, Choose two channels from both sides"
 }
}

function displayCompare(){
    let channel1=JSON.parse(firstSearchUl.dataset.channel)
    let channel2=JSON.parse(secondSearchUl.dataset.channel)
    console.log(channel1)
   
    //video count elements creation------------------------------
    let videoLabel=document.createElement('div')
    compareResult.appendChild(videoLabel)
    videoLabel.textContent="Video count"

    let winnerName1=document.createElement('p')
    compareResult.appendChild(winnerName1)

    //view count elements creation------------------------------
    let viewLabel=document.createElement('div')
    compareResult.appendChild(viewLabel)
    viewLabel.textContent="View count"

    let winnerName2=document.createElement('p')
    compareResult.appendChild(winnerName2)

    //subscriber elements creation------------------------------
    let subLabel=document.createElement('div')
    compareResult.appendChild(subLabel)
    subLabel.textContent="Subscriber count"

    let winnerName3=document.createElement('p')
    compareResult.appendChild(winnerName3)

    //let labels=[videoLabel,viewLabel,subLabel]

    //video count comparison
        if(channel1.statistics.videoCount > channel2.statistics.videoCount){
            winnerName1.textContent=channel1.snippet.title
        }
        else if(channel1.statistics.videoCount < channel2.statistics.videoCount){
            winnerName1.textContent=channel2.snippet.title 
        }
        else{
            winnerName1.textContent="Equal"
        }

    //view count comparison    
    if(channel1.statistics.viewCount > channel2.statistics.viewCount){
        winnerName2.textContent=channel1.snippet.title 
    }
    else if(channel1.statistics.viewCount < channel2.statistics.viewCount){
        winnerName2.textContent=channel2.snippet.title 
    }
    else{
        winnerName2.textContent="Equal"
    }

    //sub count comparison    
    if(channel1.statistics.subscriberCount > channel2.statistics.subscriberCount){
        winnerName3.textContent=channel1.snippet.title 
    }
    else if(channel1.statistics.subscriberCount < channel2.statistics.subscriberCount){
        winnerName3.textContent=channel2.snippet.title 
    }
    else{
        winnerName3.textContent="Equal"
    }
}
    