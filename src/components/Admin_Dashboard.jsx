import { Typography, Card,CardContent,CardMedia } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CreateIcon from '@mui/icons-material/Create';
import Icon from '@mui/material/Icon';
import { useEffect, useState } from "react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import AddItemForm from "./AddItemForm";
import AddIcon from '@mui/icons-material/Add';

const Admin_Dashboard = () => {
  const [foods,setFoods] = useState([]);
  const [showForm,setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null);
  const fetchFood = async () => {
    let foodArray = [];
    const querySnapshot = await getDocs(collection(db, "foods")); 
    querySnapshot.forEach((doc) => {
      foodArray.push({id: doc.id, ...doc.data()});
    });
    setFoods(foodArray);
  }

  const handleDelete = async(id) => {
    await deleteDoc(doc(db, "foods", id));
    fetchFood();
  }

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  }

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  }

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  }


  useEffect(()=>{
    fetchFood();
  },[]);
  return (
    <div style={{marginTop:"25px"}}>
      <Typography variant="h4" style={{textAlign:"center"}}>Admin Dashboard</Typography>
      <div className="menu__items__list">
        {
          foods.map((item)=>{
            return(
              <Card key={item.name}  sx={{ maxWidth: 345 }} className="menu__items__card">
                <CardContent>
                <CardMedia component="img" height="200" image={item.img} alt="green iguana"/>
                  <Typography variant='h5' sx={{paddingTop:2}}>{item.name}</Typography>
                  <Typography variant="caption">Category: {item.typeofcourse}</Typography><br />
                  <Typography variant="caption">{item.veg_or_not?"Vegetarin":"Non Vegetarin"}</Typography><br/>
                  <Typography variant="caption">Stock:{item.stock}</Typography><br/>
                  <Typography variant='caption' sx={{paddingBottom:2}}>Price: ₹{item.price}</Typography>
                </CardContent>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                <IconButton color="primary" aria-label="create" onClick={() => handleEdit(item)}>
                    <CreateIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete" onClick={()=> handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Card>
            )
          })
        }
      </div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      {/* <Button size="large" color="primary">
        <Icon sx={{ fontSize: 80 }}>add_circle</Icon>
      </Button> */}
            <IconButton 
        color="primary" 
        aria-label="add item"
        onClick={() => setShowForm(true)}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
        size="large"
      >
        <AddIcon style={{fontSize:50,color:'whitesmoke',backgroundColor:'#3f51b5',borderRadius:'50%'}}/>
      </IconButton>
      {showForm && (
        <AddItemForm 
          onClose={handleCloseForm} 
          onSubmit={fetchFood} 
          item={editingItem} 
        />
      )}
    </div>
  )
}

export default Admin_Dashboard




// import { useEffect, useState } from "react";
// import { Typography, Card, CardContent, CardMedia, IconButton, Icon } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';
// import CreateIcon from '@mui/icons-material/Create';
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { db } from '../firebaseConfig';
// import AddItemForm from './AddItemForm';

// const Admin_Dashboard = () => {
//   const [foods, setFoods] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);

//   const fetchFood = async () => {
//     let foodArray = [];
//     const querySnapshot = await getDocs(collection(db, "foods"));
//     querySnapshot.forEach((doc) => {
//       foodArray.push({id: doc.id, ...doc.data()});
//     });
//     setFoods(foodArray);
//   }

//   const handleDelete = async(id) => {
//     await deleteDoc(doc(db, "foods", id));
//     fetchFood();
//   }

//   const handleEdit = (item) => {
//     setEditingItem(item);
//     setShowForm(true);
//   }

//   const handleAdd = () => {
//     setEditingItem(null);
//     setShowForm(true);
//   }

//   const handleCloseForm = () => {
//     setShowForm(false);
//     setEditingItem(null);
//   }

//   useEffect(() => {
//     fetchFood();
//   }, []);

//   return (
//     <>
//       <Typography variant="h4" gutterBottom>
//         Admin Dashboard
//       </Typography>
//       {foods.map((item) => (
//         <Card key={item.id} sx={{ marginBottom: 2 }}>
//           <CardMedia
//             component="img"
//             height="140"
//             image={item.img}
//             alt={item.name}
//           />
//           <CardContent>
//             <Typography variant="h5" component="div">
//               {item.name}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Category: {item.typeofcourse}
//               <br />
//               {item.veg_or_not ? "Vegetarian" : "Non-Vegetarian"}
//               <br />
//               Stock: {item.stock}
//               <br />
//               Price: ₹{item.price}
//             </Typography>
//             <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
//               <CreateIcon />
//             </IconButton>
//             <IconButton aria-label="delete" onClick={() => handleDelete(item.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </CardContent>
//         </Card>
//       ))}
//       <IconButton 
//         color="primary" 
//         aria-label="add item"
//         onClick={handleAdd}
//         style={{ position: 'fixed', bottom: 20, right: 20 }}
//       >
//         <Icon>add_circle</Icon>
//       </IconButton>
//       {showForm && (
//         <AddItemForm 
//           onClose={handleCloseForm} 
//           onSubmit={fetchFood} 
//           item={editingItem} 
//         />
//       )}
//     </>
//   );
// }

// export default Admin_Dashboard;