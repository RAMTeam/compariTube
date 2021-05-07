let key=""
let firstSearchUl=document.querySelector("#first-search-ul")
let secondSearchUl=document.querySelector("#second-search-ul")
let CompareDiv=document.getElementById("compare-column")
let CompareButton=document.getElementById("compare-button")
let firstForm=document.getElementById("first-search-form")
let secondForm= document.getElementById("second-search-form")
let compareResult = document.getElementById("compare-result")
secondSearchUl.dataset.itemChosen=false
firstSearchUl.dataset.itemChosen=false

//let channel1   //channel1 json
//let channel2   //channel2 json

// function showCompareButton(){
//     let button=document.createElement('button')
//     button.textContent="Compare"
//     CompareDiv.
// }
CompareDiv.style.visibility = "hidden"
firstForm.addEventListener("submit",function(e){getSearchResult(e,firstSearchUl)})
secondForm.addEventListener("submit",function(e){getSearchResult(e,secondSearchUl)})
// get a search list using the form keywords
function getSearchResult(event,targetUl){
    targetUl.dataset.itemChosen=false
 
    CompareDiv.style.visibility = "hidden"
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
    let thumbnail = targetUl.parentNode.querySelector(".profile-thumbnail")
    thumbnail.innerHTML = ""
    targetUl.textContent = ""
    CompareButton.style.display="block"
    CompareDiv.style.visibility="hidden"

    // targetUl.parentNode.textContent= ""
    for(item of searchList){
        let li = document.createElement('li')
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
    // let li=document.createElement('li')
    let thumbnail = targetUl.parentNode.querySelector(".profile-thumbnail")
   
    //create the image element
    let img=document.createElement('img')
    img.src=data.snippet.thumbnails.default.url
    thumbnail.appendChild(img)

    //create the name headding
    let name=document.createElement('li')
    name.textContent=data.snippet.title
    
    targetUl.appendChild(name).classList.add("profile-heading")


    //create the video count heading 
    let vidCount=document.createElement('li')
    vidCount.innerHTML = `<span class="profile-heading">Video Counts: </span>${data.statistics.videoCount}`
    //vidCount.classList.add("vidCount")
    targetUl.appendChild(vidCount).classList.add("profile-item")

    let viewCount=document.createElement('li')
    viewCount.innerHTML=`<span class="profile-heading">View Count: </span>${data.statistics.viewCount}`
    //vidCount.classList.add("viewCount")
    targetUl.appendChild(viewCount).classList.add("profile-item")

    let subCount=document.createElement('li')
    if (data.statistics.subscriberCount){
    //subCount.classList.add("subCount")
    subCount.innerHTML=`<span class="profile-heading">Subscriber Count: </span>${data.statistics.subscriberCount}`
    }
    else{
        subCount.innerHTML=`<span class="profile-heading">Sunscribers Count: </span>Hidden`
        data=JSON.parse(targetUl.dataset.channel)
        data.statistics.subscriberCount = 0
        targetUl.dataset.channel=JSON.stringify(data)
        
        
    }
    

    targetUl.appendChild(subCount).classList.add("profile-item")
    // targetUl.appendChild(li)
}


CompareButton.addEventListener('click',getCompare)

function getCompare(){
    //compareResult.innerText = ""
    CompareDiv.style.visibility = "visible"
    console.log(firstSearchUl.dataset.itemChosen)
    console.log(secondSearchUl.dataset.itemChosen)
    if(firstSearchUl.dataset.itemChosen!="false" && secondSearchUl.dataset.itemChosen!="false") {
        displayCompare()
    }  
    else{
        let warning=document.createElement("p")
        warning.textContent="Please, Choose two channels from both sides"
        compareResult.appendChild(warning)
        warning.classList.add("warning")
    }
}

function displayCompare(){
    CompareDiv.style.visibility = "visible"
    CompareButton.style.display = "none"
    console.log(typeof firstSearchUl.dataset.itemChosen)
        let channel1=JSON.parse(firstSearchUl.dataset.channel)
        let channel2=JSON.parse(secondSearchUl.dataset.channel)
        console.log("heeeeey")

    let categoriesTags=compareResult.querySelectorAll('.category')

    let header=document.createElement('h2')
    header.textContent="winning stats"
    header.classList.add("winning-stats-heading")
    //video count elements creation------------------------------
    let videoLabel=document.createElement('h4')
    videoLabel.classList.add("cat-item-title")
    categoriesTags[0].appendChild(videoLabel)
    
    videoLabel.textContent="Video count"

    let winnerName1=document.createElement('p')
    categoriesTags[0].appendChild(winnerName1)
    winnerName1.classList.add("cat-item-winner")

    //view count elements creation------------------------------
    let viewLabel=document.createElement('h4')
    categoriesTags[1].appendChild(viewLabel)
    viewLabel.textContent = "View count"
    viewLabel.classList.add("cat-item-title")

    let winnerName2=document.createElement('p')
    categoriesTags[1].appendChild(winnerName2)
    winnerName2.classList.add("cat-item-winner")

    //subscriber elements creation------------------------------
    let subLabel=document.createElement('p')
    subLabel.textContent = "Subscriber count"
    categoriesTags[2].appendChild(subLabel)
    subLabel.classList.add("cat-item-title")

    let winnerName3=document.createElement('p')
    categoriesTags[2].appendChild(winnerName3)
    winnerName3.classList.add("cat-item-winner")
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

