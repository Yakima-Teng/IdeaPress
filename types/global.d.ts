declare namespace TS {

  interface ICarousel {
    id: number
    img: string
    link: string
    name: string
    order: number
    position: string
  }
  interface IMenu {
    id: number
    name: string
    link: string
    order: number
    position: string
  }

  interface ISiteSetting {
    siteTitle: string
    siteSubTitle: string
    siteDesc: string
    siteKeywords: string
    siteBeian: string
    siteLogo: string
    siteCopyright: string

    // 标题分隔符
    siteTitleSeparator: string

    homeTitle: string
    homeKeywords: string
    homeDesc: string
    homeBigBannerTitle: string
    homeBigBannerDesc: string
    homeBigBannerBtn1Label: string
    homeBigBannerBtn1Link: string
    homeBigBannerBtn2Label: string
    homeBigBannerBtn2Link: string
    homeTopAdImageLink: string
    homeTopAdJumpLink: string
    menus: IMenu[]
    carousels: ICarousel[]
  }

  interface IUser {
    id: number
    username: string
    password: string
    displayName: string
    avatar: string
    email: string
    phone: string
    role: string
  }

  type TLoginUser = Omit<IUser, 'password'>

  interface IPostCat {
    id: number
    alias: string
    name: string
    order: number
    position: string
  }

  interface IPost {
    id: number
    cover: string
    title: string
    abstract: string
    content: string
    status: string
    catId: number
    author: string
    source: string
    tag: string
  }

  type IPostCatWithPosts = IPostCat & {
    posts: IPost[]
  }

  type IPostWithCat = IPost & {
    postCat: IpostCat
  }

  interface IOption<T> {
    value: T
    label: string
  }

  interface IResponse<T> {
    code: number
    message: string
    data: T
  }
}

export = TS;

export as namespace TS;

declare global {
  interface Window {}
}
