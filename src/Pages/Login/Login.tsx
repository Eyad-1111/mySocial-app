import { Alert, Button, FieldError, Input, Spinner, TextField } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginSchemaType } from '../../lib/Schemas/Auth.schema';
import { loginUser } from '../../Services/auth.service';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { TokenContext } from '../../Components/Context/tokenContext';

export default function Login() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const tokenContext = useContext(TokenContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function submitData(values: LoginSchemaType) {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await loginUser(values);
      const token = response.data.data.token;

      localStorage.setItem('userToken', token);
      tokenContext?.setToken(token);

      toast.success(response.data.message, {
        duration: 4000,
        position: 'top-right',
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    }
  }

  return (
    <>
      <main>
        <section>
          <h1 className="text-4xl font-black text-main">Log in to Route Posts</h1>
          <p className="py-6 font-lg">log in and continue your social journey.</p>

          {successMessage && (
            <Alert status="success" className="bg-green-200">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{successMessage}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          {errorMessage && (
            <Alert status="danger" className="bg-red-200">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{errorMessage}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          <form className="space-y-5 pt-4" onSubmit={handleSubmit(submitData)}>
            <TextField aria-label="email" className="w-full" isInvalid={Boolean(errors.email)}>
              <Input
                {...register('email')}
                aria-label="Email"
                type="email"
                className="w-full rounded-xl"
                placeholder="Email"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>

            <TextField aria-label="password" className="w-full" isInvalid={Boolean(errors.password)}>
              <Input
                {...register('password')}
                aria-label="password"
                type="password"
                className="w-full rounded-xl"
                placeholder="Password"
              />
              <FieldError>{errors.password?.message}</FieldError>
            </TextField>

            <Button type="submit" className="w-full rounded-md bg-main">
              {isSubmitting ? (
                <div className="flex gap-2">
                  <Spinner className="text-white" />
                  <p>Loading</p>
                </div>
              ) : (
                'login'
              )}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}




