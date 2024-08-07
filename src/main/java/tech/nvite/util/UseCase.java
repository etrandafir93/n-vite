package tech.nvite.util;

@org.springframework.stereotype.Component
public @interface UseCase {
    @org.springframework.core.annotation.AliasFor(annotation = org.springframework.stereotype.Component.class)
    java.lang.String value() default "";
}