
// Interface for FB object (if not defined elsewhere)
export interface FacebookAuthCallbackPayload {
  authResponse: {
    code: string
  }
}
export interface Facebook {
  init (config: FacebookInitConfig): void
  login (callback: (payload: FacebookAuthCallbackPayload) => void, options?: FacebookLoginOptions): void
}

// Interface for FB.init config
export interface FacebookInitConfig {
  appId: string
  autoLogAppEvents?: boolean
  xfbml?: boolean
  version: string
}

// Interface for FB.login callback response
export interface FacebookLoginResponse {
  authResponse?: {
    code: string
  }
}

// Interface for FB.login options (optional)
export interface FacebookLoginOptions {
  config_id: string
  response_type: string
  override_default_response_type?: boolean
  extras?: any
}

// Interface for Window object (if FB is not globally defined)
export interface WindowWithFB {
  FB?: Facebook
}