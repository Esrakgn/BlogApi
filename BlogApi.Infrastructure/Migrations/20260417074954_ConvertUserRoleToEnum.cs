using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogApi.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConvertUserRoleToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // String role değerlerini yeni enum karşılıklarına çeviriyoruz
            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = '1'
                WHERE [Role] = 'Admin';
            """);

            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = '2'
                WHERE [Role] = 'Author';
            """);

            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = '3'
                WHERE [Role] = 'User';
            """);

            migrationBuilder.AlterColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = 'Admin'
                WHERE [Role] = '1';
            """);

            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = 'Author'
                WHERE [Role] = '2';
            """);

            migrationBuilder.Sql("""
                UPDATE [Users]
                SET [Role] = 'User'
                WHERE [Role] = '3';
            """);
        }
    }
}
