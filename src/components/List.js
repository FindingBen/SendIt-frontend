import React,{useState,useEffect} from 'react'
import { MDBListGroup,MDBListGroupItem } from "mdb-react-ui-kit";
import ImgList from './ImgList';
import TextComponent from './TextComponent';
const List = ({children,element}) => {
    const [items, setItems] = useState([children]);
    const [elementItem, setElementItems] = useState([])
    useEffect(() => {
        setElementItems(element)
        setItems(children);
      }, [children]);

      console.log(items)
  return (
    
      <MDBListGroup
                    style={{ minWidthL: "22rem" }}
                    light
                    id="myList"
                  >
                {items &&
                      items?.map((item, index) => (
                        <MDBListGroupItem id="elItem" key={index}>
                          {item.element_type === "Img" ? (
                            <ImgList
                              imageUrl={`${item.image}`}
                              //alt="Italian Trulli"
                            ></ImgList>
                          ) : (
                            <TextComponent
                              textValue={item.text}
                            ></TextComponent>
                          )}
                        </MDBListGroupItem>
                      ))}
                  </MDBListGroup>
    
  )
}

export default List