async function changeBackground(type) {
    switch(type){
        case 'japan':
            image = "url('./מדיה/תמונות/סושי/סאן%20שיין.jpg')"
            break
        case 'asia':
            image = "url(./מדיה/תמונות/אסיאתי/אוטסומאמי%20קארי.jpg)"
            break
        case 'italy':
            image = "url('./מדיה/תמונות/איטלקי/לינגוויני\ סלמון.jpg')"
            break
        case 'meat':
            image = "url('./מדיה/תמונות/בשר/שיפודי\ פרגית.jpg')"
            break
    }
    for(i=1;i>0.5;i=i-0.02){
        document.querySelector('.types').style.opacity = i
        await new Promise(resolve => setTimeout(resolve, 1));
    }
    document.querySelector('.types').style.backgroundImage = image;
    for(i=0.5;i<1;i=i+0.02){
        document.querySelector('.types').style.opacity = i
        await new Promise(resolve => setTimeout(resolve, 1));
    }

}
