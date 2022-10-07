
// function patientlist(){
//   const router = express.Router();
//   router.get('/', function (req, res) {
//     res.send("saad");
// });

// }



async function updatepatient(id,patient2) {
    const patient= await Patient.findById(id)
    if(!patient){
      return
    }
    patient.pet_name=patient2.pname
    patient.pet_type=patient2.ptype
    patient.owner_name=patient2.ownername
    patient.owner_address=patient2.owneraddress
    patient.owner_phonenumber=patient2.ownerphonenumber
    const result =await patient.save()
    server.put('/',(req,res)=>{
      res.send(patient)
    })
  }
  patient2= {
    pname: "fifi",
    ptype: "cat",
    ownername: "Saad",
    owneraddress: "Lahore",
    ownerphonenumber: "4210020123",
  };
  addpatient(patient2)
  updatepatient('633d624124b0ae0ff0ac82f2',patient2)
  // patientlist()
  {
    "pet_name" : "Foxi",
    "pet_type" : "cat",
    "owner_name": "saad",
    "owner_address": "Lahore",
    "owner_phonenumber": "0345612"
}

server.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.send(id)
  Patient.deleteOne((err,val) =>{
    if(err){
      console.log(err)
    }else{
      res.send(val.owner_name);
    }
  })
  
});



function patientdetail(id){
  const patient=Patient.findById(id)
  console.log(id)
    if(!patient){
      return
    }else{
      console.log(patient)
      return patient.options
    }
  
}