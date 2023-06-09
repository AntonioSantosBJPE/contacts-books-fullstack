"use client";
import { AsideInfosLogo } from "@/components/AsideInfosLogo";
import { AxiosInterceptor } from "@/components/AxiosInterceptor";
import { Button } from "@/components/Button";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { Form } from "@/components/Form";
import { AlertValidatePasswordRegister } from "@/components/Form/AlertValidatePasswordRegister";
import { AuthContext } from "@/contexts/AuthContext";
import { Iclient, IloginClient } from "@/contexts/types";
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { schema, TregisterData } from "./schema";
import styles from "./styles.module.scss";
import { handlePhone } from "./utils";

export default function RegisterPage() {
  const { udpateClient, openSnackBar } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TregisterData>({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const accountRegister = async (data: TregisterData) => {
    try {
      setIsLoading(true);
      const response = await api.post<Iclient>("/clients", data);
      const responseLogin = await api.post<IloginClient>("/login", data);
      udpateClient(response.data);
      const { accessToken } = responseLogin.data;
      api.defaults.headers.common.authorization = `Bearer ${accessToken}`;
      setCookie(undefined, "@contacts-book:token", accessToken, {
        maxAge: 60 * 60 * 1,
      });

      openSnackBar("success", "Cadastro realizado!");
      router.push("/dashboard");
    } catch (error: any) {
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <AxiosInterceptor>
      <div className={styles.container}>
        <main className={styles.containerMain}>
          <div>
            <AsideInfosLogo />
            <section>
              <h2> Crie sua conta</h2>

              <Form onSubmit={handleSubmit(accountRegister)}>
                <Input
                  id="input-name"
                  labelName="Nome"
                  type="text"
                  linkForm={register("name")}
                  error={errors.name?.message}
                  placeholder={"Digite seu nome"}
                  key={"name"}
                />

                <Input
                  id="input-email"
                  labelName="Email"
                  type="email"
                  linkForm={register("email")}
                  error={errors.email?.message}
                  placeholder={"Digite seu email"}
                  key={"email"}
                />

                <Input
                  id="input-phone"
                  labelName="Telefone"
                  type="text"
                  linkForm={register("phone")}
                  error={errors.phone?.message}
                  placeholder={"(xx)xxxxx-xxxx"}
                  onChange={(event) => handlePhone(event)}
                  maxLength={14}
                  key={"phone"}
                />

                <Input
                  id="input-password"
                  labelName="Senha"
                  type="password"
                  linkForm={register("password")}
                  placeholder={"Digite sua senha"}
                  key={"password"}
                />

                <Input
                  id="input-confirm-password"
                  labelName="Confirmação de senha"
                  type="password"
                  linkForm={register("confirmPassword")}
                  placeholder={"Digite sua senha novamente"}
                  key={"confirmPassword"}
                />

                <AlertValidatePasswordRegister
                  valueInputPassword={getValues().password}
                  errorPassword={errors.password?.message}
                  valueInputConfirmPassword={getValues().confirmPassword}
                  errorConfirmPassword={errors.confirmPassword?.message}
                />
                <Button
                  type="submit"
                  style="buttonLargeBlack"
                  isDisabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    "Registrar"
                  )}
                </Button>
              </Form>
              <div>
                <div>
                  <p> Já está cadastrado? </p>
                  <Link href={"/login"}>Login</Link>
                </div>
                <div>
                  <p> ou </p>
                </div>
                <div>
                  <p>Voltar para home? </p>
                  <Link href={"/"}>
                    <Image
                      src={"/iconHome.svg"}
                      alt="icon home"
                      width={20}
                      height={20}
                    />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </main>
        <CustomSnackbar />
      </div>
    </AxiosInterceptor>
  );
}
