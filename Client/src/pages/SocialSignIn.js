import React from 'react';
import { doSocialSignIn } from '../firebase/FirebaseFunctions';
import googleSigninImg from '../images/GoogleSignIn.png'

const SocialSignIn = () => {
    const socialSignOn = async (provider) => {
        try {
            await doSocialSignIn(provider);
        } catch (error) {
            alert(error);
        }
    };
    return (
        <div>
            <img
                onClick={() => socialSignOn('google')}
                alt='google signin'
                src={googleSigninImg}
            />
        </div>
    );
};

export default SocialSignIn;