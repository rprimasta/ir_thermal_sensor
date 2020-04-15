const Settings = {
    Data:{
        Treshold_Suhu : 37,
        Treshold_Jarak : 8
    },
    Save: ()=>{
       
        localStorage.setItem('config.data',JSON.stringify(Settings.Data));
    },
    Load: ()=>{

        let data = JSON.parse(localStorage.getItem('config.data'));
        if (data  == null)
            Settings.Save();
        else
            Settings.Data = data
        

        
       
    }
}

export default Settings;