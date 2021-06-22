package eu.luminis.ecsdemo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.EnableAspectJAutoProxy

@SpringBootApplication
@EnableAspectJAutoProxy
class EcsDemoApplication

fun main(args: Array<String>) {
    runApplication<EcsDemoApplication>(*args)
}
