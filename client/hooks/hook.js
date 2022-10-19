import { useState, useEffect } from 'react';
import axios from 'axios';

function useApi(endpoint) {
    console.log('--useApi')
    const [loading, setLoading] = useState(true);
    const [responseData, setResponseData] = useState(false);

    useEffect(()=>{
        setLoading(true);
        const controller = new AbortController();
        axios.get(endpoint, {
            signal: controller.signal
        }).then(({data}) => {
            setResponseData(data)
            setLoading(false);
        })
        .catch(err=>{
            setLoading(false);
            if (axios.isCancel(err)) {
                return;
            }
            setResponseData(false);
            console.log(err);
        });

        return ()=>{
            controller.abort();
        }
    }, [endpoint]);
    return [responseData, loading];
}

export default useApi;
