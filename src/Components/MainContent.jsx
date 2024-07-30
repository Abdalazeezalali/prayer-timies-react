import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import fjr from"../assets/fajr-prayer.png"
import dhhr from"../assets/dhhr-prayer-mosque.png"
import asr from"../assets/asr-prayer-mosque.png"
import sunset from"../assets/sunset-prayer-mosque.png"
import eshaa from"../assets/night-prayer-mosque.png"
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useState ,useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "moment/dist//locale/ar-ly";
moment.locale("ar");
export default function MainContent() {
    const getTimings=async ()=>{
        const response= await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SY&city=${selectedCity.apiName}`)
        setTimings(response.data.data.timings)
    }
    const [remainingTime,setRemainingTime]=useState("")
    const[nextPrayerIndex,setNextPrayerIndex]=useState(0)
    const [timer,setTimer]=useState(10)
    const[today,setToday]=useState("")
    const[timings,setTimings]=useState({
        Fajr:"",
        Dhuhr:"",
        Asr:"",
        Maghrib:"",
        Isha:""
    })
    const handleChange = (event) => {
        const cityObject=avilableCites.find((city)=>{
            return city.apiName==event.target.value
        })
        setSelectedCity(cityObject)
    };
    const [selectedCity,setSelectedCity]=useState({
        displayName:"حلب",
        apiName:"Aleppo"
    })
    const avilableCites=[
        {
        displayName:"حلب",
        apiName:"Aleppo",},
        {
            displayName:"دمشق",
            apiName:"Damascus"
        },{
            
            displayName:"حمص",
            apiName:"Homs"
        }
        ]
        const prayersArray=[
            {
                key:"Fajr",
                displayName:"الفجر"
            },
            {
                key:"Dhuhr",
                displayName:"الضهر"
            },
            {
                key:"Asr",
                displayName:"العصر"
            },
            {
                key:"Maghrib",
                displayName:"المغرب"
            },
            {
                key:"Isha",
                displayName:"العشاء"
            },
        ]
        useEffect(()=>{
            getTimings()
        
        },[selectedCity])
        useEffect(()=>{
            const t=moment()
            setToday(t.format("MMM Do YYYY | h:mm a"))
            let interval=setInterval(()=>{
                setupCountDownTimer()
            },1000)
            return ()=>{
                clearInterval(interval)
            }
        },[timings])
        const setupCountDownTimer=()=>{
            const momentNow=moment();
            let nextPrayerIndex=0;
            if(momentNow.isAfter(moment(timings["Fajr"],"hh:mm")) &&momentNow.isBefore(moment(timings["Dhuhr"],"hh:mm"))){
                nextPrayerIndex=1
            }
            else if(momentNow.isAfter(moment(timings["Dhuhr"],"hh:mm")) &&momentNow.isBefore(moment(timings["Asr"],"hh:mm"))){                
                nextPrayerIndex=2
            }
            else if(momentNow.isAfter(moment(timings["Asr"],"hh:mm")) &&momentNow.isBefore(moment(timings["Maghrib"],"hh:mm"))){                
                nextPrayerIndex=3
            }
            else if(momentNow.isAfter(moment(timings["Maghrib"],"hh:mm")) &&momentNow.isBefore(moment(timings["Isha"],"hh:mm"))){                
                nextPrayerIndex=4
            }
            else {
                nextPrayerIndex=0
            }
            setNextPrayerIndex(nextPrayerIndex)
            const nextPrayerObject=prayersArray[nextPrayerIndex]
            const nextPrayerTime=timings[nextPrayerObject.key]
            const nextPrayerTimeMoment=moment(nextPrayerTime,"hh:mm")
            let remainingTime=moment(nextPrayerTime,"hh:mm").diff(momentNow)
            if(remainingTime<0){
                const midNightDiff=moment("23:59:59","hh:mm:ss").diff(momentNow)
                const fajrToMidNightDiff=nextPrayerTimeMoment.diff(moment("00:00:00","hh:mm:ss"))
                const totalDiff=midNightDiff+fajrToMidNightDiff
                remainingTime=totalDiff
            }
            const durationRemainingTime=moment.duration(remainingTime)
            setRemainingTime(`${durationRemainingTime.hours()}:${durationRemainingTime.minutes()}:${durationRemainingTime.seconds()}`)
            const isha=timings("Isha")
            const ishaMoment=moment(isha,"hh:mm")
            
        }
    return (
    <>
    
    {/* top row*/ }
        <Grid container >
            <Grid xs={6}>
                <div>
                    <h2>
                    {today}
                    </h2>
                    <h1>
                    {selectedCity.displayName}
                    </h1>
                   
                </div>
            </Grid>
            <Grid xs={6}>
            <div>
                <h2>
                متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
                </h2>
                <h1>
                {remainingTime}
                </h1>
            </div>
        </Grid>
        </Grid>
            {/* end top row*/ }
            <Divider style={{borderColor:"white",opacity:"0.3"}} />
            {/*Prayers card */}
                <Stack direction={'row'} justifyContent={'space-evenly'} style={{marginTop:"50px"}} >
                    <Prayer name="الفجر" time={timings.Fajr} image={fjr}/>
                    <Prayer name="الظهر" time={timings.Dhuhr} image={dhhr}/>
                    <Prayer name="العصر" time={timings.Asr} image={asr}/>
                    <Prayer name="المغرب" time={timings.Maghrib} image={sunset}/>
                    <Prayer name="العشاء" time={timings.Isha} image={eshaa}/>
                </Stack>
            {/*end Prayers card */}
            {/*select city */}
                <Stack direction={"row"}  justifyContent={'center'} style={{marginTop:"20px"}}>
                        <FormControl style={{width:"20%"}}>
                            <InputLabel id="demo-simple-select-label">
                            <span style={{color:"white"}}>
                            المدينة
                            </span>
                            </InputLabel>
                            <Select
                            style={{color:"white"}}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={handleChange}
                            >
                            {avilableCites.map((city)=>{
                                return(
                                    <MenuItem value={city.apiName} key={city.apiName}>
                                    {city.displayName}
                                    </MenuItem>
                                )
                            })}
                            
                            
                            </Select>
                        </FormControl>
                </Stack>
            {/*end select */}
    </>
    
    )
}
