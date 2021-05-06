let key="AIzaSyCCPAkF6jdSihNadlIKbLgYdU-47G0Pc2o"
let firstSearchUl=document.getElementById("first-search-ul")
let secondSearchUl=document.getElementById("second-search-ul")
let firstForm=document.getElementById("first-search-form")
let secondForm= document.getElementById("second-search-form")

firstForm.addEventListener("submit",function(e){getSearchResult(e,firstSearchUl)})
secondForm.addEventListener("submit",function(e){getSearchResult(e,secondSearchUl)})

// get a search list using the form keywords
function getSearchResult(event,targetUl){
    event.preventDefault(); 
    searchBar=event.target.querySelector('input[type=text]')
    if(searchBar.value!=''){
     fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchBar.value}&key=${key}`)
    .then(response=>response.json())
    .then(function(data){
        console.log(filterUniqeChannels(data.items))
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
    console.log(searchList)
    targetUl.textContent=""
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
    fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channelId}&key=${key}`)
    .then(data=>data.json())
    .then(data=>data.items[0])
    .then(function(data){displayChannelDetails(data,targetUl)})
}

function displayChannelDetails(data,targetUl){
    targetUl.textContent=''
    let li=document.createElement('li')

    let img=document.createElement('img')
    img.src=data.snippet.thumbnails.default.url
    li.appendChild(img)

    let name=document.createElement('h3')
    name.textContent=data.snippet.title
    li.appendChild(name)

    let vidCount=document.createElement('h3')
    vidCount.textContent=data.statistics.videoCount
    li.appendChild(vidCount)

    let viewCount=document.createElement('h3')
    viewCount.textContent=data.statistics.viewCount
    li.appendChild(viewCount)

    let subCount=document.createElement('h3')
    subCount.textContent=data.statistics.subscriberCount
    li.appendChild(subCount)
    targetUl.appendChild(li)
}