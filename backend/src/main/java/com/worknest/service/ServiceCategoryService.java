package com.worknest.service;

import com.worknest.model.ServiceCategory;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ServiceCategoryService {

    public List<ServiceCategory> getAll() {
        return Arrays.asList(ServiceCategory.values());
    }
}
