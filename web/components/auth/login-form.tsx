'use client'

import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginForm() {
  const { loginUser } = useAuth();
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await loginUser(values);
    if (error) {
      toast.error(t('auth.login_failed'));
    } else {
      router.push(`/${locale}/(dashboard)/fleet`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            className="font-semibold text-gray-900 hover:underline dark:text-gray-50"
            href={`/${locale}/(auth)/register`}
          >
            Register
          </Link>
        </p>
      </form>
    </Form>
  )
}
