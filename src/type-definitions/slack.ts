export interface SlackUser {
  id: string
  deleted: boolean
  profile: {
    real_name: string
    image_32: string
  }
  is_bot: boolean
  is_app_user: boolean
}

export interface SlackChannel {
  id: string
  name: string
  num_members: number
}