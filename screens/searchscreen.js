import React from 'react';
import { StyleSheet, Text, View,  TextInput ,FlatList,TouchableOpacity} from 'react-native';
import db from '../config'
import { ScrollView } from 'react-native-gesture-handler';

export default class searchScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      allTransactions:[],
      lastvisibleTransaction:null,
      search:''

    }

  }
  fetchtransaction = async()=>{
    var textentered = text.split("")
    var text = this.state.search.toUpperCase()
  
    if(textentered[0].toUpperCase==='B'){
      const query = await db.collection("transaction").where('bookid', '==', text).startAfter(this.state.lastvisibleTransaction).limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions, doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
    else if(textentered[0].toUpperCase==='S'){
      const query = await db.collection("transaction").where('studentid', '==', text).startAfter(this.state.lastvisibleTransaction).limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions, doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
  }
  
  componentDidMount = async()=>{
    const query = await db.collection("transaction").limit(10).get()
    query.docs.map((doc)=>{
      this.setState({
        allTransactions:[],
        lastvisibleTransaction:doc
      })
    })
  }
  searchTransaction = async(text)=>{
    var textentered = text.split("")
    //var text = text.UpperCase()
    if(textentered[0].toUpperCase==='B'){
      const transaction = await db.collection("transaction").where('bookid', '==', text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions, doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
    else if(textentered[0].toUpperCase==='S'){
      const transaction = await db.collection("transaction").where('studentid', '==', text).get()
      transaction.docs.map((doc)=>{
        this.setState({
          allTransactions:[...this.state.allTransactions, doc.data()],
          lastvisibleTransaction:doc
        })
      })
    }
  }
    render(){
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}> 
      <TextInput style={styles.bar}
      placeholder="enter id"
      onChangeText={(text)=>{this.setState({search:text})}}/>
      <TouchableOpacity style={styles.searchButton} onPress={()=>{this.searchTransaction(this.state.search)}}><Text>search</Text></TouchableOpacity>
      </View>

    <FlatList
      data={this.state.allTransactions}
      renderItem = {({item})=>(
        <View style={{borderBottomWidth:3}}>
        <Text>{"bookid:"+item.bookid}</Text>
        <Text>{"studentid:"+item.studentid}</Text>
        
        <Text>{"transactiontype:"+item.transactiontype}</Text>
        <Text>{"date:"+item.date.toDate()}</Text>
        
      </View>
    

      )}
      keyExtractor = {(item,index)=>index.toString()}
      onEndReached = {this.fetchtransaction}
      onEndReachedThreshold = {0.7}
      />
      </View>
        )
}
}
const styles = StyleSheet.create({ 
  container: { flex: 1, marginTop: 20 },
   searchBar:{ flexDirection:'row', height:40, width:'auto', borderWidth:0.5, alignItems:'center', backgroundColor:'grey', },
    bar:{ borderWidth:2, height:30, width:300, paddingLeft:10, },
     searchButton:{ borderWidth:1, height:30, width:50, alignItems:'center', justifyContent:'center', backgroundColor:'green' } 
    })
