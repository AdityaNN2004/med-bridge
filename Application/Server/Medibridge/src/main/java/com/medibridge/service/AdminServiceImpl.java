package com.medibridge.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medibridge.dtos.DonarDto;
import com.medibridge.entities.donar.Donar;
import com.medibridge.repository.DonarRepository;

@Service
public class AdminServiceImpl implements AdminService{
	
	@Autowired
	private DonarRepository donarRepository;
	@Autowired
	private ModelMapper mdeMapper;
	@Override
	public List<DonarDto> getAllDonars() {
		List<Donar> donarslist = donarRepository.findAll(); 
		
		List<DonarDto> donarDtoList = new ArrayList<>();
		
		for(Donar donar: donarslist)
		{
			DonarDto donarDto = mdeMapper.map(donar, DonarDto.class);
			donarDto.setEmail(donar.getUser().getEmail());
			donarDto.setMobile(donar.getUser().getMobile());
			donarDtoList.add(donarDto);
		}
		return donarDtoList;
		 
	}

}
