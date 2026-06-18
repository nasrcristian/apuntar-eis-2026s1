package ar.edu.unq.apuntar.model.material
import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import tools.jackson.databind.annotation.JsonSerialize
import tools.jackson.databind.ser.std.ToStringSerializer
import java.util.Date


@Document(collection = "comments")
data class Comment(
    @Id
    @JsonSerialize(using = ToStringSerializer::class)
    val id: ObjectId = ObjectId(),
    val materialId: Long,  // FK lógica hacia PSQL
    val userId: String?,
    val text: String,
    val authorName: String?,
    val createdAt: Date = Date()
)