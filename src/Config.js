var Settings = {
    Data:{
        Treshold_Suhu : 37
    },
    Save: ()=>{
        localStorage.setItem('config.data',JSON.stringify(Settings.Data));
    },
    Load: ()=>{
        try {
            Settings.Data = localStorage.setItem('config.data',JSON.parse(Settings.Data));
        } catch (error) {
            Settings.Save();
        }
       
    }
}

export default Settings;