import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ButtonLoader from '../../components/layout/ButtonLoader';
import { toast } from 'react-toastify';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { clearErrors, userLogin } from '../../redux/actions/userActions';

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);

  const { loading, success, error } = useSelector((state) => state.login);

  useEffect(() => {
    if (success) {
      toast.success(success);
      setTimeout(() => {
        router.push('/game');
      }, 6000);

      if (error) {
        toast.error(error);
        dispatch(clearErrors());
      }
    }
  }, [dispatch, success, error]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const loginData = {
      username,
      password,
    };

    dispatch(userLogin(loginData));

    // setLoading(true);

    // try {
    //   const result = await axios.post('http://localhost:4000/api/login', data);
    //
    //   router.push('/game');
    // } catch (error) {
    //   setTimeout(() => {
    //     setLoading(false);
    //     toast.error(error.response.data.message);
    //   }, 1000);
    // }
  };

  const responseGoogle = async (response) => {
    try {
      const tokenId = response.tokenId;
      const result = await axios.post('http://localhost:4000/api/loginGoogle', {
        tokenId,
      });
      localStorage.setItem('accessToken', result.data.data.accessToken);
      router.push('/game');
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="container container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3" style={{ textAlign: 'center' }}>
              SIGN IN
            </h1>
            <div className="form-group">
              <label htmlFor="username_field">Username</label>
              <input
                type="text"
                id="username_field"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <a href="#" className="float-left mb-4">
              <Link href="/forgotpassword">Forgot Password?</Link>
            </a>

            <button
              id="login_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
              style={{ marginBottom: '10px' }}
            >
              {loading ? <ButtonLoader /> : 'LOGIN'}
            </button>
            <span>LOGIN WITH</span>
            <GoogleLogin
              clientId="82188546756-iikurufha30hocipiu2f6f8i0hq91aua.apps.googleusercontent.com"
              buttonText="GOOGLE"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
            <div>
              <span className="float-left mt-2">
                Don't have an account?
                <Link href="/register" class="float-right mt-3">
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
