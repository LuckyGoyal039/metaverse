import React, { useState } from 'react';
import avatar60 from '../../assets/avatar_60_dancing.png'
import { useNavigate } from 'react-router-dom';
import Spinner from '../../component/spinner';
import { toast, ToastContainer } from 'react-toastify';
interface FormData {
  username: string;
  password: string;
  type: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    type: 'user',
  });
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigateTo = (url: string) => {
    navigate(url)
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL;
    const url = `${HTTP_SERVER_URL}/signup`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        toast.error("Unable to SignUp", {
          position: "top-center"
        })
        const errorData = await res.json();
        console.error("Error during sign-in:", errorData);
        return;
      }
      toast.success("SignUp Successfully", {
        position: "top-center"
      })

      setTimeout(() => {
        navigate('/signin');
      }, 2000)
    } catch (error) {
      toast.error("Unable to SignUp", {
        position: "top-center"
      })
      console.error("Network error during sign-in:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-[#282d4e]">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <button onClick={() => navigateTo('#')} className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-12 mr-2" src={avatar60} alt="logo" />
            Welcome to Meta
          </button>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#2e376e] dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Sign Up
              </h1>
              <h6 className='font-bold text-gray-900 dark:text-white'>
                Create Your Virtual Reality Today!
              </h6>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                  <select
                    name="type"
                    id="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#282d4e] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="user" selected>User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className='flex gap-3 items-center'>
                  <button onClick={() => navigateTo('/')} type="button" className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm h-12 px-3 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Back to Home</button>

                  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm h-12 w-24 dark:bg-blue-600 dark:hover:bg-blue-700"> {isLoading ? <Spinner /> : "Submit"}</button>
                </div>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account? <button onClick={() => navigateTo("/signin")} className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-400">Login here</button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </>
  );
};

export default Signup;
