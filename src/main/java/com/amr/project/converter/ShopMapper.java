package com.amr.project.converter;

import com.amr.project.model.dto.ShopDto;
import com.amr.project.model.entity.Shop;
import com.amr.project.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * @author denisqaa on 29.07.2021.
 * @project platform
 */


@Mapper(unmappedTargetPolicy = org.mapstruct.ReportingPolicy.IGNORE,
        uses = {ReviewMapper.class, ImageMapper.class},
        componentModel = "spring")
public interface ShopMapper {

    ShopMapper INSTANCE = Mappers.getMapper(ShopMapper.class);

    @Mappings({
            @Mapping(source = "user.username", target = "username"),
            @Mapping(source = "logo.url", target = "logo"),
            @Mapping(source = "location.name", target = "location")
    })
    ShopDto shopToShopDto(Shop shop);

    @Mappings({
            @Mapping(source = "username", target = "user.username"),
            @Mapping(source = "location", target = "location.name"),
            @Mapping(source = "logo", target = "logo.url")
    })
    Shop shopDtoToShop(ShopDto shopDto);


    default Long map(Shop shop) {
        return shop.getId();
    }

    default String map(User user) {
        return user != null ? user.getUsername() : "No user!";
    }


    List<ShopDto> toShopDto(List<Shop> shop);
}
