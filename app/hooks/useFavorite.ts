
// Hook for toggling favorite id
// comunicate with backend

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

import { SafeUser } from '../types';

import useLoginModal from './useLoginModal';


interface IUseFavorite {
    listingId: string;
    currentUser?: SafeUser | null;
}

// look how we use interface , alittle different than other case but act the same
const useFavorite = ({
    listingId,
    currentUser
}: IUseFavorite) =>{

    const router = useRouter();
    const LoginModal = useLoginModal();

    // checking the the current user already favorited the place in list
    // to make heart red if already favorited
    const hasFavorited = useMemo(() => {
        const list = currentUser?.favoriteIds || [];
        // .includes() returns boolean
        return list.includes(listingId);

    }, [ currentUser, listingId ])

    

    // toggle
    const toggleFavorite = useCallback( async (
        e:React.MouseEvent<HTMLElement>
    ) =>{
        e.stopPropagation();
        // opening LoginModal if not logged in
        if( !currentUser ){
            return LoginModal.onOpen();
        }

        try{
            let request;

            if (hasFavorited) {
                // =()=> make reques a function type
                request = () => axios.delete(`/api/favorites/${listingId}`);
            }
            else{
                request = () => axios.post(`/api/favorites/${listingId}`);
            }

            await request();

            // refreshing so we get updated version of currentUser
            router.refresh();
            toast.success('success');
        }
        catch(error){
            toast.error('something went wrong');
        }

    },[
        currentUser,
        hasFavorited,
        listingId,
        LoginModal,
        router,
    ]);

    return{
        hasFavorited,
        toggleFavorite,
    }
}

export default useFavorite;
