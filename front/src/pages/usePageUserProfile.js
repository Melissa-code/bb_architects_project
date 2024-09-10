import {useQuery} from "@tanstack/react-query";
import {fetchGetProfile} from "../utils/fetch.js";

function usePageUserProfile() {
    const token = localStorage.getItem('BBStorage_token');
    const {data, error, isError} = useQuery({
        queryKey: ['GetUserProfile'],
        queryFn: () => fetchGetProfile(token),
        enabled: !!token
    })
    isError && console.log(error)
    console.log(data)
    return {data}
}

export default usePageUserProfile