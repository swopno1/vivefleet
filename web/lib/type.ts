export type PageProps = {
  params: Promise<{ locale: string }>
}

export type PagePropsWithChildren = PageProps & { children: React.ReactNode }
