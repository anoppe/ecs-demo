package eu.luminis.ecsdemo

import com.amazonaws.xray.javax.servlet.AWSXRayServletFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.servlet.Filter


@Configuration
class AwsXRayConfig {
    @Bean
    fun tracingFilter(): Filter {
        return AWSXRayServletFilter("ecsdemo")
    }
}
