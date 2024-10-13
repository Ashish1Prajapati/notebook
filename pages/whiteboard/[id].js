import CanvasPage from '@/components/whiteboard/CanvasPage';
import React, { useEffect, useState } from 'react'

const WhiteboardWithId = ({id}) => {
    const [data, setData] = useState(null);
    useEffect(() => {
      const saved = localStorage.getItem("data");
      const parsedData = JSON.parse(saved);
      const requiredData=parsedData?.find((el)=>el.id===id)
      setData(requiredData);
    }, [id]);
    
  return (
    <div>
       <CanvasPage initialData={data} />
    </div>
  )
}

export default WhiteboardWithId
export const getServerSideProps = async (ctx) => {
    console.log(ctx)
      const {id } = ctx.query
      return { props: { id } };
  };
