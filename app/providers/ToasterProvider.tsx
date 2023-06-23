'use client';

// we use provider because most of npm packages arenot adjusted to next 13
// eg: Toaster need use effect but we want add it to layout tsx which doesnot support useEffect
import { Toaster } from 'react-hot-toast';

const ToasterProvider =() => {
    return(
        <Toaster />
    )
}

export default ToasterProvider;
