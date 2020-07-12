import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from 'firebase';
import db from '../config'
export default class transactionScreen extends React.Component {
  constructor(){
    super();
    this.state={
      hasCameraPermissions:null,
       scanned:false,
        
        buttonState:'normal',
         scanBookId:'',
         scanStudentId:'',
         transactionmessage:''
        }

      
  }
  getCameraPermissions = async(id)=>{
    const {status}=await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonState:id,
      scanned:false
    })
  }
  handleBarcodeScan = async({type,data})=>{
    const {buttonState} = this.state
    if(buttonState==="BOOKID"){
    this.setState({scanned:true,scanBookId:data, buttonState:'normal'})
  }
  else if(buttonState==="STUDENTID"){
    this.setState({
      scanned: true,
      scanStudentId: data,
      buttonState: 'normal'
    });
}
  }
  handleTransaction = async()=>{
    var transactiontype = await this.checkBookeligibility();
    if(!transactiontype){
      Alert.alert("the book does not exist in database")
      this.setState({scanStudentId:'', scanBookId:''})
    }
    else if(transactiontype==="issue"){
      var isStudenteligible = await this.checkStudenteligibilityforBookissue();
      if(isStudenteligible){
        this.initiatebookissue();
        Alert.alert("book issued to student")
      }
    }
    else{
      var isStudenteligible = await this.checkStudenteligibilityforBookreturn();
      if(isStudenteligible){
        this.initiatebookreturn();
        Alert.alert("book returned ")
      }
    }
     
  }
  checkStudenteligibilityforBookissue=async()=>{
    const studentRef = await db.collection("STUDENTS").where("studentid","==",this.state.scanStudentId).get();
    var isStudenteligible = ""
    if(studentRef.docs.length === 0){
      this.setState({scanStudentId:'',scanBookId:''})
      isStudenteligible=false
      Alert.alert("student id does not exist in database")
    }
    else{
      studentRef.docs.map((doc)=>{
        var student = doc.data();
        if(student.NOofbooksissued < 2){
          isStudenteligible = true
        }
        else{
          isStudenteligible = false
          Alert.alert("student is already issued 2 books")
          this.setState({scanStudentId:'',scanBookId:''})
        }
  
      })
    }
    return isStudenteligible
  }

  checkStudenteligibilityforBookreturn=async()=>{
    const transactionRef = await db.collection("transaction").where("bookid","==",this.state.scanBookId).limit(1).get();
    var isStudenteligible = ""
    transactionRef.docs.map((doc)=>{
      var lastbookTransaction = doc.data();
      if(lastbookTransaction.studentid === this.state.scanStudentId){
        isStudenteligible = true
      }
      else{
        isStudenteligible = false
        Alert.alert("book was not issued by this student")
        this.setState({scanStudentId:'',scanBookId:''})
      }
    })
    
    return isStudenteligible
  }

  checkBookeligibility=async()=>{
    const bookref = await db.collection("BOOKS").where("bookid","==",this.state.scanBookId).get()
    var transactiontype = ""
    if(bookref.docs.length===0){
      transactiontype = false
      console.log(bookref.docs.length)
    }
    else{
      bookref.docs.map((doc)=>{
        var book = doc.data()
        if(book.bookavailability){
          transactiontype = "issue"
        }
        else{
          transactiontype = "return"
        }
      })
    }
    return transactiontype
  }
  
    initiatebookissue=async()=>{
    db.collection("transaction").add({
      studentid:this.state.scanStudentId,
      bookid:this.state.scanBookId,
      date:firebase.firestore.Timestamp.now().toDate(),
      transactiontype:"issue"
    })
    db.collection("BOOKS").doc(this.state.scanBookId).update({
      bookavailability:false
    })
    db.collection("STUDENTS").doc(this.state.scanStudentId).update({
      NOofbooksissued:firebase.firestore.FieldValue.increment(1)
    })
   
  }
  initiatebookreturn=async()=>{
    db.collection("transaction").add({
      studentid:this.state.scanStudentId,
      bookid:this.state.scanBookId,
      date:firebase.firestore.Timestamp.now().toDate(),
      transactiontype:"return"
    })
    db.collection("BOOKS").doc(this.state.scanBookId).update({
      bookavailability:true
    })
    db.collection("STUDENTS").doc(this.state.scanStudentId).update({
      NOofbooksissued:firebase.firestore.FieldValue.increment(-1)
    })
    
  }
    render(){
const hasCameraPermissions=this.state.hasCameraPermissions;
const scanned = this.state.scanned;    
const buttonState = this.state.buttonState;
if(buttonState!=="normal" && hasCameraPermissions){
  return(
    <BarCodeScanner
     onBarCodeScanned={scanned?undefined:this.handleBarcodeScan}
    style = {StyleSheet.absoluteFillObject}/>
    
  )
}
else if(buttonState==="normal"){
return (
  <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
    
      <View>
        <Image 
        source={require('../assets/booklogo.jpg')} 
        style={{width:30,height:45}}/>
        <Text style = {{textAlign:'center',fontSize:20}}>wirlib</Text></View>      
       
       
        <View style={styles.inputView}>
        <TextInput style={styles.inputBox}
        placeholder="BOOKID" 
        onChangeText={text=>this.setState({scanBookId:text})}
        value={this.state.scanBookId}/>

         <TouchableOpacity style={styles.scanButton} 
         onPress={()=>{this.getCameraPermissions("BOOKID")}}>  
         <Text style={styles.buttonText}>Scan </Text>
         </TouchableOpacity>
         </View>


         <View style={styles.inputView}>
        <TextInput style={styles.inputBox}
        placeholder="STUDENTID" 
        onChangeText={text=>this.setState({scanStudentId:text})}
        value={this.state.scanStudentId}/>
         <TouchableOpacity style={styles.scanButton} 
         onPress={()=>{this.getCameraPermissions("STUDENTID")}}>
           <Text style={styles.buttonText}>Scan</Text>
         </TouchableOpacity>
         </View>
       <TouchableOpacity style={styles.submitbutton} onPress={async()=>{var transactionmessage = await this.handleTransaction();
       }}>
<Text style={styles.subtext}>submit</Text>
       </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
}
}

const styles = StyleSheet.create({container:{
  flex:1,
  justifyContent:'center',
  alignItems:'center'},
displayText:{
  fontSize : 20,
  textDecorationLine:'underline',
},
scanButton:{
  backgroundColor:'red',
  margin:10,
},
buttonText:{
  fontSize:22,
},
inputView:{
flexDirection:'row',
margin:25,
},
inputBox:{
  width:120,
  height:20,
  borderWidth:2,
  fontSize:18,
},
submitbutton:{
  backgroundColor:'green',
  width:50,
  height:35,
},
subtext:{
  textAlign:'center',
  fontSize:16,
  color:'black',
}

})