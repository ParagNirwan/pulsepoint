package com.news.pulsepoint.dto;

public class AuthenticationResponse {

    private String token;
    private String username;
    private String planType;

    public AuthenticationResponse() {
    }

    public AuthenticationResponse(String token, String username, String planType) {
        this.token = token;
        this.username = username;
        this.planType = planType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }
}
