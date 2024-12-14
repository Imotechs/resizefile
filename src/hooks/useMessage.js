import { message } from "antd";

export const useMessage=()=>{

    const [messageApi, contextHolder] = message.useMessage();

    const showMessage=(status, message)=>{
        messageApi.open({
            type: status,
            content: message,
          });
    }


    return {showMessage, contextHolder}

}