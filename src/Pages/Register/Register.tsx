import { Alert, Button, FieldError, Input, Spinner, TextField } from '@heroui/react'
import { ListBox, Select } from "@heroui/react";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { registerSchema, type RegisterSchemaType } from '../../lib/Schemas/Auth.schema';
import { registerUser } from '../../Services/auth.service';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast/headless';
import { useNavigate } from 'react-router';


export default function Register() {

  const [successMessage, setsuccessMessage] = useState("");
  const [errorMessage, seterrorMessage] = useState("")

  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: '',
      username: '',
      email: '',
      dateOfBirth: '',
      gender: '',
      password: '',
      rePassword: '',
    },

  });

  async function submitData(values: RegisterSchemaType) {
    console.log(values);
    seterrorMessage("");
    setsuccessMessage("");

    try {
      const response = await registerUser(values);

      console.log(response);
      //messagee
      console.log(response.data.message);
      // setsuccessMessage(response.data.message)
      toast.success(response.data.message), {
        duration: 4000,
        position: "top-right",
        // style: {backgroundColor: "red" , color: "white"} ,
      };

      //navigate to login 
      setTimeout(() => {
        navigate("/auth");
      }, 1500)
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
        // seterrorMessage(error.response?.data?.message)
        toast.error(error.response?.data?.message)

      }
    }
  }


  return (
    <>
      <main>
        <section>
          <h1 className=" text-4xl font-black text-main">Create a new account</h1>
          <p className='py-6 font-lg'>It is quick and easy . </p>
          {successMessage && (
            <>

              <Alert status='success' className='bg-green-200'>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{successMessage}</Alert.Title>
                </Alert.Content>
              </Alert>
            </>
          )}
          {errorMessage && <>
            <Alert status='danger' className='bg-red-200'>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{errorMessage}</Alert.Title>
              </Alert.Content>
            </Alert>
          </>}


          <form className="space-y-5 pt-4" onSubmit={handleSubmit(submitData)}>

            <TextField
              aria-label='name'
              className="w-full"
              isInvalid={Boolean(errors.name)}
            >
              <Input
                {...register('name')}
                aria-label="FullName"
                className="w-full rounded-xl"
                placeholder="Full Name"
              />

              <FieldError>{errors.name?.message} </FieldError>
            </TextField>

            <TextField
              aria-label='username'
              className="w-full"
              isInvalid={Boolean(errors.username)}
            >

              <Input
                {...register('username')}
                aria-label="userName"
                className="w-full rounded-xl"
                placeholder="User Name" />

              <FieldError>{errors.username?.message} </FieldError>
            </TextField>


            <TextField
              aria-label='email'
              className="w-full"
              isInvalid={Boolean(errors.email)}
            >
              <Input
                {...register('email')}
                aria-label="Email"
                type="email"
                className="w-full rounded-xl"
                placeholder="Email" />
              <FieldError>{errors.email?.message} </FieldError>
            </TextField>

            <TextField
              aria-label='gender'
              className="w-full"
              isInvalid={Boolean(errors.gender)}
            >

              <Controller
                name="gender"
                control={control}
                render={({ field }) => {


                  return (
                    <>
                      {<Select
                        {...field}
                        aria-label="Gender"
                        className="w-full"
                        placeholder="Select Gender">

                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="male" textValue="male">
                              Male
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="female" textValue="female">
                              Female
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>}

                    </>
                  )
                }
                }
              />
              <FieldError>{errors.gender?.message} </FieldError>
            </TextField>

            <TextField
              aria-label='dateOfBirth'
              className="w-full"
              isInvalid={Boolean(errors.dateOfBirth)}
            >
              <Input
                {...register('dateOfBirth')}
                aria-label="date"
                type="date"
                className="w-full rounded-xl" />
              <FieldError>{errors.dateOfBirth?.message} </FieldError>
            </TextField>



            <TextField
              aria-label='password'
              className="w-full"
              isInvalid={Boolean(errors.password)}
            >
              <Input
                {...register('password')}
                aria-label="password"
                type="password"
                className="w-full rounded-xl"
                placeholder="Password" />
              <FieldError>{errors.password?.message} </FieldError>
            </TextField>

            <TextField
              aria-label='rePassword'
              className="w-full"
              isInvalid={Boolean(errors.rePassword)}
            >
              <Input
                {...register('rePassword')}
                aria-label="re-password"
                type="password"
                className="w-full rounded-xl"
                placeholder="Confirm Password" />
              <FieldError>{errors.rePassword?.message} </FieldError>
            </TextField>



            <Button type="submit" className="rounded-md bg-main w-full">
              {isSubmitting ? <div className='flex gap-2'>
                <Spinner className='text-white' />
                <p>Loading</p>
              </div>
                : "Create New Account "}
            </Button>


          </form>
        </section>
      </main >


    </>
  );
}





