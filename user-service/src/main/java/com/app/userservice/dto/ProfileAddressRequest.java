package com.app.userservice.dto;

import com.app.userservice.entity.Address;
import com.app.userservice.entity.UserProfile;


public class ProfileAddressRequest {

    private UserProfile profile;

    public UserProfile getProfile() {
		return profile;
	}

	public void setProfile(UserProfile profile) {
		this.profile = profile;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	private Address address;
}
